<?php
namespace App\Controller;

use App\Entity\Contact;
use App\Form\ContactType;

use Psr\Log\LoggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;


/**
 * @Route("/contact")
 *
 */
class ContactController extends AbstractController
{
    
    /**
     * @Route("/new", name="contact_new", methods={"GET","POST"})
     */    
    public function contactMail(Request $request, MailerInterface $mailer, TranslatorInterface $translator): Response
    {
        $newContact = new Contact();
        $form = $this->createForm(ContactType::class, $newContact);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $firstName = $form->get('firstname')->getData();
            $lastName = $form->get('lastname')->getData();
            $email = $form->get('email')->getData();
            $content = $form->get('content')->getData();
            
            // Stocker en bdd
            $em = $this->getDoctrine()->getManager();
            $em->persist($newContact);
            $em->flush();
            
            // envoi du message
            $emailNewContact = (new TemplatedEmail())
                ->from('share@garden-exchange.org')
                ->to('share@garden-exchange.org')
                //~ ->cc($email)
                //->bcc('bcc@example.com')
                //->replyTo('fabien@example.com')
                //->priority(Email::PRIORITY_HIGH)
                ->subject($translator->trans('email.new.message.admin'))
                ->htmlTemplate('emails/new_contact.html.twig')
                // pass variables (name => value) to the template
                ->context([
                    'username' => $firstName,
                    'firstName' => $firstName,
                    'lastName' => $lastName,
                    'emailContact' => $email,
                    'content' => $content,
                ]);
            try {
                $mailer->send($emailNewContact);
            } catch (TransportExceptionInterface $e) {
                // some error prevented the email sending; display an
                // error message or try to resend the message
            }
            $this->addFlash('success', 'contact.sended_successfully');
            return $this->redirectToRoute('homepage');
        }

        return $this->render('contact/contact_mail.html.twig', [
            'contactForm' => $form->createView(),
        ]);
    }

}
