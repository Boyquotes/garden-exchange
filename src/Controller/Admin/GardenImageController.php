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
use App\Security\GardenVoter;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;


/**
 *
 * @Route("/admin/garden/images")
 * @IsGranted("ROLE_CAMPER")
 *
 * @author Boyquotes
 */
class GardenImageController extends AbstractController
{    
    /**
     * @Route("/upload/garden/{gardenId}", name="garden_upload_image", methods={"POST"})
     * @ParamConverter("garden", options={"mapping": {"gardenId" : "id"}})
     */
    public function uploadGardenImage(Request $request, Garden $garden){
        $token = $request->request->get('tokenGarden');

        $response = array(
            'status' => 'error',
            'filename' => 'Erreur',
            'content' => 'Impossible d\'ajouter ce media'
        );
        
        $media = $request->files->get('file');
        
        $filename = $media->getClientOriginalName();
        $randTitre = rand(10000, 19000);
        $filename_rand_token = $token."_".$randTitre."__".$filename;
        $contentFile = file_get_contents($media->getPathname());

        // move media file in uploads directory
        $media->move(
            $this->getParameter('garden_images_directory'),
            $filename_rand_token
        );

        // insert media in database
        $img = new GardenImage();
        $img->setName($filename_rand_token);
        $img->setGarden($garden);
        $img->setCreatedAt(new \DateTime("now"));

        $em = $this->getDoctrine()->getManager();
        $em->persist($img);
        $em->flush();

        $response = array(
            'status' => 'success',
            'gid' => $img->getId(),
            'content' => 'Image ajoutee'
        );

        return new JsonResponse($response, 200);
    }
    
    /**
     * @Route("/{gardenImageId}/delete", name="garden_delete_image", methods={"DELETE"})
     * @ParamConverter("gardenImage", options={"mapping": {"gardenImageId" : "id"}})
     */
    public function deleteGardenImage(Request $request, GardenImage $gardenImage){
        $token = $request->request->get('_token');

        if($this->isCsrfTokenValid('delete'.$gardenImage->getId(), $token)){
            $name = $gardenImage->getName();
            unlink($this->getParameter('garden_images_directory').'/'.$name);

            $em = $this->getDoctrine()->getManager();
            $em->remove($gardenImage);
            $em->flush();

            return new JsonResponse(['success' => 1]);
        }else{
            return new JsonResponse(['error' => 'Token Invalid'], 400);
        }
    }
    
    /**
     * @Route("/{gardenImageId}/legend", name="garden_legend_image", methods={"POST"})
     * @ParamConverter("gardenImage", options={"mapping": {"gardenImageId" : "id"}})
     */
    public function legendGardenImage(Request $request, GardenImage $gardenImage){
        $token = $request->request->get('_token');
        $recupData = $request->request->get('recupData');

        if($this->isCsrfTokenValid('legend'.$gardenImage->getId(), $token)){
            $gardenImage->setLibelle($recupData);

            $em = $this->getDoctrine()->getManager();
            $em->flush();

            return new JsonResponse(['success' => 1]);
        }else{
            return new JsonResponse(['error' => 'Token Invalid'], 400);
        }
    }

}
