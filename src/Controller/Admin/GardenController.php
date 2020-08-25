<?php

/*
 *
 * (c) Nicolas Villa <nicolas@ge.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Controller\Admin;

use App\Entity\Garden;
use App\Entity\GardenImage;
use App\Form\GardenType;
use App\Repository\GardenRepository;
use App\Security\GardenVoter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;


/**
 *
 * @Route("/admin/garden")
 * @IsGranted("ROLE_CAMPER")
 *
 * @author Boyquotes
 */
class GardenController extends AbstractController
{
    /**
     * Lists all Garden entities.
     *
     * This controller responds to two different routes with the same URL:
     *   * 'admin_garden_index' is the route with a name that follows the same
     *     structure as the rest of the controllers of this class.
     *   * 'admin_index' is a nice shortcut to the backend homepage. This allows
     *     to create simpler links in the templates. Moreover, in the future we
     *     could move this annotation to any other controller while maintaining
     *     the route name and therefore, without breaking any existing link.
     *
     * @Route("/", methods="GET", name="admin_index")
     * @Route("/", methods="GET", name="admin_garden_index")
     */
    public function index(GardenRepository $gardens): Response
    {
        $authorGardens = $gardens->findAll();

        return $this->render('admin/garden/listing_garden_admin.html.twig', ['gardens' => $authorGardens]);
    }

    /**
     * Creates a new Garden entity.
     *
     * @Route("/new", methods="GET|POST", name="admin_garden_new")
     *
     * NOTE: the Method annotation is optional, but it's a recommended practice
     * to constraint the HTTP methods each controller responds to (by default
     * it responds to all methods).
     */
    public function new(Request $request, MailerInterface $mailer): Response
    {
        $garden = new Garden();
        $gps = false;
        //~ $equipments = $garden->getEquipments();
        //~ $equipments = $this->entityManager->getRepository('AppBundle:Equipment')->findAll();
        //~ $equipments= $this->getDoctrine()->getRepository(Equipment::class)->findAll();
        //~ dump($equipments);
        //~ $garden->setAuthor($this->getUser());

        // See https://symfony.com/doc/current/form/multiple_buttons.html
        $form = $this->createForm(GardenType::class, $garden);


        $form->handleRequest($request);

        // the isSubmitted() method is completely optional because the other
        // isValid() method already checks whether the form is submitted.
        // However, we explicitly add it to improve code readability.
        // See https://symfony.com/doc/current/forms.html#processing-forms
        if ($form->isSubmitted() && $form->isValid()) {
            $garden->setUser($this->getUser());

            //~ Geocode de l'adresse
            $street = $form->get('street')->getData();
            $postcode = $form->get('postcode')->getData();
            $city = $form->get('city')->getData();
            $country = $form->get('country')->getData();
            //~ dump($street);
            //~ dump($postcode);
            //~ dump($city);
            //~ dump($country);
            //~ $data = array(
              //~ 'street'     => '26 rue des kermes',
              //~ 'postalcode' => $postcode,
              //~ 'city'       => $city,
              //~ 'country'    => $country,
              //~ 'format'     => 'json',
            //~ );
            
            $data = array(
              'street'     => '',
              'postalcode' => $postcode,
              'city'       => $city,
              'country'    => $country,
              'format'     => 'json',
            );
            $url = 'https://nominatim.openstreetmap.org/?' . http_build_query($data);
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mettre ici un user-agent adéquat');
            $geopos = curl_exec($ch);
            curl_close($ch);

            $json_data = json_decode($geopos, true);
            dump($json_data);
            if(count($json_data) != 0){
                $latCity = $json_data[0]['lat'];
                $lngCity = $json_data[0]['lon'];
                dump($latCity);
                dump($lngCity);
                $garden->setLatCity($latCity);
                $garden->setLngCity($lngCity);
                $gps = true;
            }
            $data = array(
              'street'     => $street,
              'postalcode' => $postcode,
              'city'       => $city,
              'country'    => $country,
              'format'     => 'json',
            );
            $url = 'https://nominatim.openstreetmap.org/?' . http_build_query($data);
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mettre ici un user-agent adéquat');
            $geopos = curl_exec($ch);
            curl_close($ch);

            $json_data = json_decode($geopos, true);
            if(count($json_data) != 0){
                $lat = $json_data[0]['lat'];
                $lng = $json_data[0]['lon'];
                dump($lat);
                dump($lng);
                $garden->setLat($lat);
                $garden->setLng($lng);
                $gps = true;
            }

            if(!$gps){
                $garden->setEnabled(0);
            }

            // On récupère les images transmises
            $images = $form->get('gardenImages')->getData();
            
            // On boucle sur les images
            foreach($images as $image){
                // On génère un nouveau nom de fichier
                $fichier = md5(uniqid()).'.'.$image->guessExtension();
                
                // On copie le fichier dans le dossier uploads
                $image->move(
                    $this->getParameter('garden_images_directory'),
                    $fichier
                );
                
                // On crée l'image dans la base de données
                $img = new GardenImage();
                $img->setName($fichier);
                $img->setCreatedAt(new \DateTime("now"));
                $garden->addGardenImage($img);
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($garden);
            $em->flush();

            // Flash messages are used to notify the user about the result of the
            // actions. They are deleted automatically from the session as soon
            // as they are accessed.
            // See https://symfony.com/doc/current/controller.html#flash-messages
            $this->addFlash('success', 'garden.created_successfully');
            
            $email = (new Email())
                ->from('share@ge.org')
                ->to('nicolas@montpellibre.fr')
                //->cc('cc@example.com')
                //->bcc('bcc@example.com')
                //->replyTo('fabien@example.com')
                //->priority(Email::PRIORITY_HIGH)
                ->subject('Nouveau jardin')
                ->text('Nouveau jardin : ')
                ->html('<p>See Twig integration for better HTML integration!</p>');

            try {
                $mailer->send($email);
            } catch (TransportExceptionInterface $e) {
                // some error prevented the email sending; display an
                // error message or try to resend the message
            }

            return $this->redirectToRoute('admin_garden_index');
        }

        return $this->render('admin/garden/new.html.twig', [
            'garden' => $garden,
            'form' => $form->createView(),
        ]);
    }

    /**
     * Finds and displays a Garden entity.
     *
     * @Route("/{id<\d+>}", methods="GET", name="admin_garden_show")
     */
    public function show(Garden $garden): Response
    {
        // This security check can also be performed
        // using an annotation: @IsGranted("show", subject="garden", message="Gardens can only be shown to their authors.")
        $this->denyAccessUnlessGranted(GardenVoter::VIEW, $garden, 'Gardens can only be shown to their authors.');

        return $this->render('admin/garden/show.html.twig', [
            'garden' => $garden,
        ]);
    }

    /**
     * Displays a form to edit an existing Garden entity.
     *
     * @Route("/{id<\d+>}/edit", methods="GET|POST", name="admin_garden_edit")
     * @IsGranted("edit", subject="garden", message="Gardens can only be edited by their authors.")
     */
    public function edit(Request $request, Garden $garden): Response
    {
        $form = $this->createForm(GardenType::class, $garden);
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            // On récupère les images transmises
            $images = $form->get('gardenImages')->getData();
            
            // On boucle sur les images
            foreach($images as $image){
                // On génère un nouveau nom de fichier
                $fichier = md5(uniqid()).'.'.$image->guessExtension();
                
                // On copie le fichier dans le dossier uploads
                $image->move(
                    $this->getParameter('garden_images_directory'),
                    $fichier
                );
                
                // On crée l'image dans la base de données
                $img = new GardenImage();
                $img->setName($fichier);
                $img->setCreatedAt(new \DateTime("now"));
                $garden->addGardenImage($img);
            }

            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', 'garden.updated_successfully');

            return $this->redirectToRoute('admin_garden_edit', ['id' => $garden->getId(), 'garden' => $garden]);
        }

        return $this->render('admin/garden/edit.html.twig', [
            'garden' => $garden,
            'form' => $form->createView(),
        ]);
    }

    /**
     * Deletes a Garden entity.
     *
     * @Route("/{id}/delete", methods="POST", name="admin_garden_delete")
     * @IsGranted("delete", subject="garden")
     */
    public function delete(Request $request, Garden $garden): Response
    {
        if (!$this->isCsrfTokenValid('delete', $request->request->get('token'))) {
            return $this->redirectToRoute('admin_garden_index');
        }

        // Delete the tags associated with this blog garden. This is done automatically
        // by Doctrine, except for SQLite (the database used in this application)
        // because foreign key support is not enabled by default in SQLite
        $garden->getTags()->clear();

        $em = $this->getDoctrine()->getManager();
        $em->remove($garden);
        $em->flush();

        $this->addFlash('success', 'garden.deleted_successfully');

        return $this->redirectToRoute('admin_garden_index');
    }

}
