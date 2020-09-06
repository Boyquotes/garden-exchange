<?php
namespace App\Controller\Admin;

use App\Entity\Profile;
use App\Form\ProfileType;
use App\Form\Type\UserProfileType;
use App\Repository\ProfileRepository;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Controller used to manage current user.
 *
 * @Route("/profile")
 * @IsGranted("ROLE_CAMPER")
 *
 */
class ProfileController extends AbstractController
{
    /**
     * @Route("/{id}", methods="GET|POST", name="user_profile_info")
     */
    public function infoProfile(Request $request, Profile $profile): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $user = $this->getUser();
        
        return $this->render('profile/info.html.twig', [
            'profile' => $profile,
        ]);
    }
    
    /**
     * @Route("/info/edit", methods="GET|POST", name="user_profile_info_edit")
     */
    public function edit(Request $request, ProfileRepository $profiles): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $user = $this->getUser();
        
        $profile = $profiles->findOneByUser($user->getId());
        if( !$profile ){
            $profile = new Profile();
            $profile->setUser($this->getUser());
        }
        
        $formData['user'] = $user;
        $formData['profile']  = $profile;
        $form = $this->createForm(UserProfileType::class, $formData);
        
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $profileImage = $form->get('profileImage')->getData();
            if($profileImage){
                $fichier = md5(uniqid()).'.'.$profileImage->guessExtension();
                $profileImage->move(
                    $this->getParameter('profile_images_directory'),
                    $fichier
                );
                $profile->setProfileImage($fichier);
            }

            $entityManager->persist($profile);
            $entityManager->flush();

            $this->addFlash('success', 'user.updated_successfully');

            return $this->redirectToRoute('user_profile_info_edit');
        }

        return $this->render('profile/edit.html.twig', [
            'profile' => $profile,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/change-password", methods="GET|POST", name="user_change_password")
     */
    public function changePassword(Request $request, UserPasswordEncoderInterface $encoder, TokenStorageInterface $securityToken): Response
    {
        $user = $this->getUser();
        $this->securityToken = $securityToken;

        $form = $this->createForm(ChangePasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setPassword($encoder->encodePassword($user, $form->get('newPassword')->getData()));

            $this->getDoctrine()->getManager()->flush();
            $this->addFlash('success', 'user.password_changed_successfully');
            
            $this->securityToken->setToken(null);
            $request->getSession()->invalidate(1);
            $request->getSession()->clear();
            
            return $this->redirectToRoute('user_edit');
        }

        return $this->render('user/change_password.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
