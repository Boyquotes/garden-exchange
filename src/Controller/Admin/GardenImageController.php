<?php

/*
 *
 * (c) Nicolas Villa <nicolas@ge.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Controller\Admin;

use App\Entity\GardenImage;
use App\Security\GardenVoter;

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
 * @Route("/admin/garden/images")
 * @IsGranted("ROLE_CAMPER")
 *
 * @author Boyquotes
 */
class GardenImageController extends AbstractController
{    
    /**
     * @Route("/{gardenImageId}/delete", name="garden_delete_image", methods={"POST", "GET", "DELETE"})
     * @ParamConverter("gardenImage", options={"mapping": {"gardenImageId" : "id"}})
     */
    public function deleteGardenImage(Request $request, GardenImage $gardenImage){
        $token = $request->request->get('_token');
        //~ dump($request->request->get('_token'));
//~ dump($request);
//~ dump($data);
//~ dump($data['_token']);
//~ exit;
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

}
