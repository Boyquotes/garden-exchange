<?php
namespace App\Controller;

use App\Entity\Profile;
use App\Entity\User;
use App\Form\RegistrationFormType;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class RegistrationController extends AbstractController
{
    /**
     * @Route("/register", name="register")
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, MailerInterface $mailer, TranslatorInterface $translator): Response
    {
        $user = new User();
        $profile = new Profile();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if (true === $form['agreeTerms']->getData()) {
                $firstName = $form->get('firstname')->getData();
                $lastName = $form->get('lastname')->getData();
                $email = $form->get('email')->getData();
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $user->setFullName($lastName.' '.$firstName);
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
                    ->from('share@garden-exchange.org')
                    ->to($email)
                    //->cc('cc@example.com')
                    //->bcc('bcc@example.com')
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

                return $this->redirectToRoute('admin_garden_new');
            }
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }
}
