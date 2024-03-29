<?php
namespace App\Controller\Admin;

use App\Entity\Post;
use App\Entity\PostImage;
use App\Form\PostType;
use App\Repository\PostRepository;
use App\Security\PostVoter;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

/**
 *
 * @Route("/admin/post")
 * @IsGranted("ROLE_ADMIN")
 *
 */
class BlogController extends AbstractController
{
    /**
     * Lists all Post entities.
     *
     * This controller responds to two different routes with the same URL:
     *   * 'admin_post_index' is the route with a name that follows the same
     *     structure as the rest of the controllers of this class.
     *   * 'admin_index' is a nice shortcut to the backend homepage. This allows
     *     to create simpler links in the templates. Moreover, in the future we
     *     could move this annotation to any other controller while maintaining
     *     the route name and therefore, without breaking any existing link.
     *
     * @Route("/", methods="GET", name="admin_post_index")
     */
    public function index(PostRepository $posts): Response
    {
        //~ $authorPosts = $posts->findBy(['author' => $this->getUser()], ['publishedAt' => 'DESC']);
        $authorPosts = $posts->findAll();

        return $this->render('admin/blog/index_blog_admin.html.twig', ['posts' => $authorPosts]);
    }

    /**
     * Creates a new Post entity.
     *
     * @Route("/new", methods="GET|POST", name="admin_post_new")
     *
     * NOTE: the Method annotation is optional, but it's a recommended practice
     * to constraint the HTTP methods each controller responds to (by default
     * it responds to all methods).
     */
    public function new(Request $request): Response
    {
        $post = new Post();
        $post->setAuthor($this->getUser());

        // See https://symfony.com/doc/current/form/multiple_buttons.html
        $form = $this->createForm(PostType::class, $post)
            ->add('saveAndCreateNew', SubmitType::class);

        $form->handleRequest($request);

        // the isSubmitted() method is completely optional because the other
        // isValid() method already checks whether the form is submitted.
        // However, we explicitly add it to improve code readability.
        // See https://symfony.com/doc/current/forms.html#processing-forms
        if ($form->isSubmitted() && $form->isValid()) {
            // On récupère les images transmises
            $images = $form->get('postImages')->getData();
            
            // On boucle sur les images
            foreach($images as $image){
                // On génère un nouveau nom de fichier
                $fichier = md5(uniqid()).'.'.$image->guessExtension();
                
                // On copie le fichier dans le dossier uploads
                $image->move(
                    $this->getParameter('post_images_directory'),
                    $fichier
                );
                
                // On crée l'image dans la base de données
                $img = new PostImage();
                $img->setName($fichier);
                $img->setCreatedAt(new \DateTime("now"));
                $post->addPostImage($img);
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($post);
            $em->flush();

            // Flash messages are used to notify the user about the result of the
            // actions. They are deleted automatically from the session as soon
            // as they are accessed.
            // See https://symfony.com/doc/current/controller.html#flash-messages
            $this->addFlash('success', 'post.created_successfully');

            if ($form->get('saveAndCreateNew')->isClicked()) {
                return $this->redirectToRoute('admin_post_new');
            }

            return $this->redirectToRoute('admin_post_index');
        }

        return $this->render('admin/blog/new.html.twig', [
            'post' => $post,
            'form' => $form->createView(),
        ]);
    }

    /**
     * Finds and displays a Post entity.
     *
     * @Route("/{id<\d+>}", methods="GET", name="admin_post_show")
     */
    public function show(Post $post): Response
    {
        // This security check can also be performed
        // using an annotation: @IsGranted("show", subject="post", message="Posts can only be shown to their authors.")
        $this->denyAccessUnlessGranted(PostVoter::SHOW, $post, 'Posts can only be shown to their authors.');

        return $this->render('admin/blog/show.html.twig', [
            'post' => $post,
        ]);
    }

    /**
     * Displays a form to edit an existing Post entity.
     *
     * @Route("/{id<\d+>}/edit", methods="GET|POST", name="admin_post_edit")
     * @IsGranted("edit", subject="post", message="Posts can only be edited by their authors.")
     */
    public function edit(Request $request, Post $post): Response
    {
        $form = $this->createForm(PostType::class, $post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // On récupère les images transmises
            $images = $form->get('postImages')->getData();
            
            // On boucle sur les images
            foreach($images as $image){
                // On génère un nouveau nom de fichier
                $fichier = md5(uniqid()).'.'.$image->guessExtension();
                
                // On copie le fichier dans le dossier uploads
                $image->move(
                    $this->getParameter('post_images_directory'),
                    $fichier
                );
                
                // On crée l'image dans la base de données
                $img = new PostImage();
                $img->setName($fichier);
                $img->setCreatedAt(new \DateTime("now"));
                $post->addPostImage($img);
            }

            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', 'post.updated_successfully');

            return $this->redirectToRoute('admin_post_edit', ['id' => $post->getId()]);
        }

        return $this->render('admin/blog/edit.html.twig', [
            'post' => $post,
            'form' => $form->createView(),
        ]);
    }

    /**
     * Deletes a Post entity.
     *
     * @Route("/{id}/delete", methods="POST", name="admin_post_delete")
     * @IsGranted("delete", subject="post")
     */
    public function delete(Request $request, Post $post): Response
    {
        if (!$this->isCsrfTokenValid('delete', $request->request->get('token'))) {
            return $this->redirectToRoute('admin_post_index');
        }

        // Delete the tags associated with this blog post. This is done automatically
        // by Doctrine, except for SQLite (the database used in this application)
        // because foreign key support is not enabled by default in SQLite
        $post->getTags()->clear();

        $em = $this->getDoctrine()->getManager();
        $em->remove($post);
        $em->flush();

        $this->addFlash('success', 'post.deleted_successfully');

        return $this->redirectToRoute('admin_post_index');
    }
    
    /**
     * @Route("/{postImageId}/delete", name="post_delete_image", methods={"DELETE"})
     * @ParamConverter("postImage", options={"mapping": {"postImageId" : "id"}})
     */
    public function deletePostImage(Request $request, PostImage $postImage){
        $token = $request->request->get('_token');

        if($this->isCsrfTokenValid('delete'.$postImage->getId(), $token)){
            $name = $postImage->getName();
            unlink($this->getParameter('post_images_directory').'/'.$name);

            $em = $this->getDoctrine()->getManager();
            $em->remove($postImage);
            $em->flush();

            return new JsonResponse(['success' => 1]);
        }else{
            return new JsonResponse(['error' => 'Token Invalid'], 400);
        }
    }
    
    /**
     * @Route("/{postImageId}/legend", name="post_legend_image", methods={"POST"})
     * @ParamConverter("postImage", options={"mapping": {"postImageId" : "id"}})
     */
    public function legendPostImage(Request $request, PostImage $postImage){
        $token = $request->request->get('_token');
        $recupData = $request->request->get('recupData');

        if($this->isCsrfTokenValid('legend'.$postImage->getId(), $token)){
            $postImage->setLibelle($recupData);

            $em = $this->getDoctrine()->getManager();
            $em->flush();

            return new JsonResponse(['success' => 1]);
        }else{
            return new JsonResponse(['error' => 'Token Invalid'], 400);
        }
    }
    
}
