<?php

/*
 *
 * (c) Nicolas Villa <nicolas@ge.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Controller\Admin;

use App\Entity\User;
use App\Repository\UserRepository;

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
 * @Route("/admin/users")
 * @IsGranted("ROLE_ADMIN")
 *
 * @author Boyquotes
 */
class UserAdminController extends AbstractController
{
    /**
     * Lists all User entities.
     *
     * @Route("/", methods="GET", name="admin_users_index")
     */
    public function indexUsers(UserRepository $users, Security $security): Response
    {
        if ($security->isGranted('ROLE_ADMIN')) {
            $allCampers = $users->findAll();
        }
        return $this->render('admin/user/listing_user_admin.html.twig', ['allCampers' => $allCampers]);
    }

}
