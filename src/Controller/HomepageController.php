<?php
namespace App\Controller;

use App\Entity\Comment;
use App\Entity\Post;
use App\Events\CommentCreatedEvent;
use App\Form\CommentType;
use App\Form\Type\SimpleSearchType;
use App\Repository\CountryRepository;
use App\Repository\GardenRepository;
use App\Repository\PostRepository;
use App\Repository\TagRepository;

use Psr\Log\LoggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/blog")
 *
 */
class HomepageController extends AbstractController
{
    public function homepage(Request $request, LoggerInterface $bigbLogger, GardenRepository $gardens, PostRepository $posts): Response
    {
        $bigbLogger->info('One hit at homepage');
        $allGardens = $gardens->findAll();
        $encartPosts = $posts->findThreeFisrt();
        $introPost = $posts->findIntro();
        $nuiteesPost = $posts->findNuitees();

        $form = $this->createForm(SimpleSearchType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $where = $form->get('where')->getData();
            return $this->redirectToRoute('garden_results', array('where' => $where));
        }

        return $this->render('default/homepage.html.twig', [
            'allGardens' => $allGardens,
            'encartPosts' => $encartPosts,
            'introPost' => $introPost,
            'nuiteesPost' => $nuiteesPost,
        ]);
    }

}
