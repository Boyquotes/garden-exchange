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
use App\Utils\Nigth;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 *
 * @Route("/admin/garden")
 * @IsGranted("ROLE_CAMPER")
 *
 * @author Boyquotes
 */
class GardenAdminController extends AbstractController
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
        public function index(GardenRepository $gardens, Security $security): Response
        {
            if ($security->isGranted('ROLE_ADMIN')) {
                $authorGardens = $gardens->findBy(array(), array('created' => 'DESC'));
            }
            else{
                $authorGardens = $gardens->findByUser($this->getUser());
            }
            return $this->render('admin/garden/listing_garden_admin.html.twig', ['allGardens' => $authorGardens]);
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
    public function new(Request $request, MailerInterface $mailer, TranslatorInterface $translator): Response
    {
        $garden = new Garden();
        $garden->setUser($this->getUser());
        $garden->setEnabled(0);
        $garden->setStatus('added');
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($garden);
        $em->flush();
        
        $form = $this->createForm(GardenType::class, $garden, [ 'action' => $this->generateUrl('admin_garden_save', array("gardenId" => $garden->getId() )) ]);

        return $this->render('admin/garden/new.html.twig', [
            'garden' => $garden,
            'form' => $form->createView(),
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

            //~ Geocode de l'adresse
            $street = $form->get('street')->getData();
            $postcode = $form->get('postcode')->getData();
            $city = $form->get('city')->getData();
            $country = $form->get('country')->getData();

            $data = array($city." ".$postcode." ".$country->getLangFR());
            $url = 'https://api-adresse.data.gouv.fr/search/?q=' . http_build_query($data);
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0');
            $geopos = curl_exec($ch);
            curl_close($ch);

            $json_data = json_decode($geopos, true);

            if(!is_null($json_data) && count($json_data) != 0){
                $lngCity = $json_data['features'][0]['geometry']['coordinates'][0];
                $latCity = $json_data['features'][0]['geometry']['coordinates'][1];
                $garden->setLatCity($latCity);
                $garden->setLngCity($lngCity);
                $gps = true;
            }
            
            $data = array($street." ".$city." ".$postcode." ".$country->getLangFR());
            $url = 'https://api-adresse.data.gouv.fr/search/?q=' . http_build_query($data);
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0');
            $geopos = curl_exec($ch);
            curl_close($ch);

            $json_data = json_decode($geopos, true);

            if(!is_null($json_data) && count($json_data) != 0){
                $lng = $json_data['features'][0]['geometry']['coordinates'][0];
                $lat = $json_data['features'][0]['geometry']['coordinates'][1];
                $garden->setLat($lat);
                $garden->setLng($lng);
                $gps = true;
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
     * Save a new Garden entity.
     *
     * @Route("/save/{gardenId}", methods="GET|POST", name="admin_garden_save")
     * @ParamConverter("garden", options={"mapping": {"gardenId" : "id"}})
     *
     * NOTE: the Method annotation is optional, but it's a recommended practice
     * to constraint the HTTP methods each controller responds to (by default
     * it responds to all methods).
     */
    public function save(Request $request, MailerInterface $mailer, TranslatorInterface $translator, Garden $garden): Response
    {
        //~ dump($request);
        //~ dump($garden);
        //~ exit;
        $user = $this->getUser();
        $gps = false;

        $form = $this->createForm(GardenType::class, $garden);

        $form->handleRequest($request);
        //~ dump($form);
        //~ exit;
        if ($form->isSubmitted() && $form->isValid()) {
            //~ dump($form);
            $garden->setUser($user);

            //~ Geocode de l'adresse
            $street = $form->get('street')->getData();
            $postcode = $form->get('postcode')->getData();
            $city = $form->get('city')->getData();
            $country = $form->get('country')->getData();

            $data = array($city." ".$postcode." ".$country->getLangFR());
            $url = 'https://api-adresse.data.gouv.fr/search/?q=' . http_build_query($data);
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0');
            $geopos = curl_exec($ch);
            curl_close($ch);

            $json_data = json_decode($geopos, true);

            if(!is_null($json_data) && count($json_data) != 0){
                $lngCity = $json_data['features'][0]['geometry']['coordinates'][0];
                $latCity = $json_data['features'][0]['geometry']['coordinates'][1];
                $garden->setLatCity($latCity);
                $garden->setLngCity($lngCity);
                $gps = true;
            }
            
            $data = array($street." ".$city." ".$postcode." ".$country->getLangFR());
            $url = 'https://api-adresse.data.gouv.fr/search/?q=' . http_build_query($data);
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0');
            $geopos = curl_exec($ch);
            curl_close($ch);

            $json_data = json_decode($geopos, true);

            if(!is_null($json_data) && count($json_data) != 0){
                $lng = $json_data['features'][0]['geometry']['coordinates'][0];
                $lat = $json_data['features'][0]['geometry']['coordinates'][1];
                $garden->setLat($lat);
                $garden->setLng($lng);
                $gps = true;
            }

            if(!$gps){
                $garden->setStatus('draft');
                $garden->setEnabled(0);
            }
            else{
                $garden->setStatus('online');
            }
            $em = $this->getDoctrine()->getManager();
            $em->flush();
    
            $this->addFlash('success', 'garden.created.successfully');
            
            $email = $user->getEmail();
            $emailNewGarden = (new TemplatedEmail())
                ->from(new Address('share@gardenbivouac.org', 'Garden Bivouac'))
                ->to($email)
                //->cc('cc@example.com')
                //->bcc('bcc@example.com')
                //->replyTo('fabien@example.com')
                //->priority(Email::PRIORITY_HIGH)
                ->subject($translator->trans('email.add.garden'))
                ->htmlTemplate('emails/new_garden.html.twig')
                // pass variables (name => value) to the template
                ->context([
                    'garden' => $garden,
                    'username' => $user->getUsername(),
                ]);
            try {
                $mailer->send($emailNewGarden);
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
     * Deletes a Garden entity.
     *
     * @Route("/{id}/delete", methods="DELETE", name="admin_garden_delete")
     * @ParamConverter("garden", options={"mapping": {"id" : "id"}})
     * @IsGranted("delete", subject="garden")
     */
    public function delete(Request $request, Garden $garden): Response
    {
        $token = $request->request->get('_token');

        if($this->isCsrfTokenValid('delete'.$garden->getId(), $token)){
            $em = $this->getDoctrine()->getManager();
            $em->remove($garden);
            $em->flush();

            return new JsonResponse(['action' => 'deleteGarden', 'success' => 1]);
        }else{
            return new JsonResponse(['error' => 'Token Invalid'], 400);
        }
    }
    
    /**
     * Deletes a Garden Modal.
     *
     * @Route("/{id}/delete/modal", methods="GET", name="admin_garden_delete_modal")
     * @ParamConverter("garden", options={"mapping": {"id" : "id"}})
     * @IsGranted("delete", subject="garden")
     */
    public function deleteGardenModal(Request $request, Garden $garden): Response
    {
        return $this->render('includes/modals/admin/garden/_garden_delete_modal_confirm.html.twig', [
            'garden' => $garden,
        ]);
    }

    /**
     * @Route("/{id}/publish", name="publish_garden", methods={"POST"})
     */
    public function publishGarden(Request $request, MailerInterface $mailer, TranslatorInterface $translator, Garden $garden, Nigth $nigth){
        $token = $request->request->get('_token');
        $user = $this->getUser();
        
        if($this->isCsrfTokenValid('publish'.$garden->getId(), $token)){
            if($garden->getEnabled()){
                $garden->setEnabled(0);
                $garden->setUpdated(new \DateTime('now'));
            }
            else{
                $garden->setEnabled(1);
                $garden->setPublishedAt(new \DateTime('now'));
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($garden);
            $em->flush();

            $email = $user->getEmail();
            $emailPublishGarden = (new TemplatedEmail())
                ->from(new Address('share@gardenbivouac.org', 'Garden Bivouac'))
                ->to($email)
                //->cc('cc@example.com')
                //->bcc('bcc@example.com')
                //->replyTo('fabien@example.com')
                //->priority(Email::PRIORITY_HIGH)
                ->subject($translator->trans('email.publish.garden'))
                ->htmlTemplate('emails/garden_online.html.twig')
                // pass variables (name => value) to the template
                ->context([
                    'garden' => $garden,
                    'username' => $user->getUsername(),
                ]);
            try {
                $mailer->send($emailPublishGarden);
            } catch (TransportExceptionInterface $e) {
                // some error prevented the email sending; display an
                // error message or try to resend the message
            }

            $nigth->addProfilNight($user, '1', 'garden_profil_ok', 'available');

            $routeReload = array( '#garden'.$garden->getId() => $this->generateUrl( 'actions_garden', array('id' => $garden->getId()) ) );
            $response = array(
                'status' => 'success',
                'route' => $routeReload
            );
            return new JsonResponse($response);
        }else{
            return new JsonResponse(['error' => 'Token Invalid'], 400);
        }
    }
    
    /**
     * @Route("/{id}/offline", name="put_offline_garden", methods={"POST"})
     */
    public function putOfflineGarden(Request $request, Garden $garden){
        $token = $request->request->get('_token');

        if($this->isCsrfTokenValid('publish'.$garden->getId(), $token)){
            $garden->setEnabled(0);

            $em = $this->getDoctrine()->getManager();
            $em->persist($garden);
            $em->flush();

            $routeReload = array( '#garden'.$garden->getId() => $this->generateUrl( 'actions_garden', array('id' => $garden->getId()) ) );
            $response = array(
                'status' => 'success',
                'route' => $routeReload
            );
            return new JsonResponse($response);
        }else{
            return new JsonResponse(['error' => 'Token Invalid'], 400);
        }
    }

    /**
     * @Route("/{id}/actions", name="actions_garden", methods={"POST", "GET"})
     */
    public function actionsGarden(Request $request, Garden $garden){
        return $this->render('garden/_garden_actions.html.twig', [
            'garden' => $garden,
        ]);
    }

}
