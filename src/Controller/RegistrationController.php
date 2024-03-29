<?php

namespace App\Controller;

use App\Entity\Profile;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\EmailVerifier;
use App\Utils\AntiBots;
use App\Utils\Nigth;

use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class RegistrationController extends AbstractController
{
    private $emailVerifier;

    public function __construct(EmailVerifier $emailVerifier)
    {
        $this->emailVerifier = $emailVerifier;
    }

    /**
     * @Route("/register", name="register")
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, MailerInterface $mailer, TranslatorInterface $translator, LoggerInterface $logger, AntiBots $antibots, Nigth $nigth): Response
    {
        $checkTime = true;
        $user = new User();
        $profile = new Profile();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if (true === $form['agreeTerms']->getData()) {
                $token = $request->request->get('registration_form')['_token'];
                
                $time = $request->get('_checkT');
                $referer = $request->get('_target_path');
                
                //~ AntiBots
                if($_SERVER['ANTI_SPAM'] == true){
                    $checkReferer = $antibots->checkReferer($referer);

                    if($time <= $_SERVER['TIME_NOT_BOT']){
                        $checkTime = false;
                    }

                    if($checkReferer == false || $checkTime == false){
                        $logger->error("Problème pour l'inscription de cet utilisateur pris pour un.e bot.e : ");
                        $this->addFlash('error', 'Votre inscription est impossible pour le moment.');

                        return $this->render('registration/register.html.twig', [
                            'registrationForm' => $form->createView(),
                        ]);
                    }
                }
                
                if($_SERVER['SEND_LOG_SPAM'] || ($checkReferer == false || $checkTime == false) ){
                    $emailLogAdmin = (new TemplatedEmail())
                        ->from(new Address('share@gardenbivouac.org', 'Garden Bivouac Tech Mail'))
                        ->to(new Address('tech@gardenbivouac.org', 'Garden Bivouac Tech Mail'))
                        //->cc('cc@example.com')
                        //->replyTo('fabien@example.com')
                        //->priority(Email::PRIORITY_HIGH)
                        ->subject($translator->trans('email.inscription'))
                        // path of the Twig template to render
                        ->htmlTemplate('emails/admin/signup_admin.html.twig')

                        // pass variables (name => value) to the template
                        ->context([
                            'expiration_date' => new \DateTime('+7 days'),
                            'username' => $user->getUsername(),
                            'referer' => $referer,
                            'time' => $time,
                            'token' => $token,
                        ]);

                    try {
                        $mailer->send($emailLogAdmin);
                    } catch (TransportExceptionInterface $e) {
                        // some error prevented the email sending; display an
                        // error message or try to resend the message
                    }
                }
                
                $firstName = $form->get('firstname')->getData();
                $lastName = $form->get('lastname')->getData();
                $email = $form->get('email')->getData();
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $user->setFullName($lastName.' '.$firstName);
                // encode the password
                $user->setPassword(
                    $passwordEncoder->encodePassword(
                        $user,
                        $form->get('password')->getData()
                    )
                );

                $user->setRoles(['ROLE_CAMPER']);
                $profile->setUser($user);
                $profile->setAgreeTerms(true);
                $profile->setAgreeTermsCreated(new \DateTime("now"));
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($user);
                $entityManager->persist($profile);
                $entityManager->flush();

                $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
                $this->get('security.token_storage')->setToken($token);

                $emailRegistration = (new TemplatedEmail())
                    ->from(new Address('share@gardenbivouac.org', 'Garden Bivouac'))
                    ->to($email)
                    //->cc('cc@example.com')
                    ->bcc('share@gardenbivouac.org')
                    //->replyTo('fabien@example.com')
                    //->priority(Email::PRIORITY_HIGH)
                    ->subject($translator->trans('email.inscription'))
                    // path of the Twig template to render
                    ->htmlTemplate('emails/signup.html.twig')

                    // pass variables (name => value) to the template
                    ->context([
                        'expiration_date' => new \DateTime('+7 days'),
                        'username' => $user->getUsername(),
                    ]);

                try {
                    $mailer->send($emailRegistration);
                } catch (TransportExceptionInterface $e) {
                    // some error prevented the email sending; display an
                    // error message or try to resend the message
                }

                // generate a signed url and email it to the user
                $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user,
                    (new TemplatedEmail())
                        ->from(new Address('verify@gardenbivouac.org', 'Garden Bivouac'))
                        ->to($user->getEmail())
                        ->bcc('share@gardenbivouac.org')
                        ->subject($translator->trans('mail.confirm.subject'))
                        ->htmlTemplate('registration/confirmation_email.html.twig')
                );

            }
            
            $nigth->addProfilNight($user, '1', 'newCamper', 'available');
            
            return $this->redirectToRoute('admin_index');
        }
        else{
            return $this->render('registration/register.html.twig', [
                'registrationForm' => $form->createView(),
            ]);
        }
    }

    /**
     * @Route("/verify/email", name="app_verify_email")
     */
    public function verifyUserEmail(Request $request, Nigth $nigth): Response
    {
        if(empty($this->getUser())){
            $request->headers->set('referer', $request->getUri());
            $referer = $request->headers->get('referer');
            return $this->redirectToRoute('security_login', array( '_target_path' => $referer) );
        }
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        
        $user = $this->getUser();
        // validate email confirmation link, sets User::isVerified=true and persists
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
            $nigth->addProfilNight($user, '1', 'mail_ok', 'available');
            // @TODO Change the redirect on success and handle or remove the flash message in your templates
            $this->addFlash('success', 'mail.verification.email.user');
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $exception->getReason());
        }

        return $this->redirectToRoute('admin_index');
    }

    /**
     * @Route("/resend/verify/email", name="resend_verification_mail")
     */
    public function resendVerificationMail(Request $request, MailerInterface $mailer, TranslatorInterface $translator): Response
    {
        $user = $this->getUser();
        // generate a signed url and email it to the user
        $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user,
            (new TemplatedEmail())
                ->from(new Address('verify@gardenbivouac.org', 'Garden Bivouac'))
                ->to($user->getEmail())
                ->bcc('share@gardenbivouac.org')
                ->subject($translator->trans('mail.confirm.subject'))
                ->htmlTemplate('registration/confirmation_email.html.twig')
        );

        // @TODO Change the redirect on success and handle or remove the flash message in your templates
        //~ $this->addFlash('success', 'resend.mail.verification.email.user');

        return new JsonResponse(['success' => $translator->trans('resend.mail.verification.email.user')]);
    }
}
