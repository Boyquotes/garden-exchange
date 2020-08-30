<?php

/*
 *
 * (c) Nicolas Villa <nicolas@ge.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Controller;

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
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;


/**
 *
 * @Route("/garden")
 *
 * @author Boyquotes
 */
class GardenController extends AbstractController
{
    /**
     * Finds and displays a Garden entity.
     *
     * @Route("/{id<\d+>}", methods="GET", name="admin_garden_show")
     */
    public function show(Garden $garden): Response
    {
        return $this->render('garden/show.html.twig', [
            'garden' => $garden,
        ]);
    }

}
