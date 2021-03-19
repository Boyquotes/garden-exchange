<?php
namespace App\Controller;

use App\Entity\Contact;
use App\Form\ContactType;
use App\Utils\AntiBots;

use Psr\Log\LoggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
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
    
    public function detectTags($string){
        // Pas de code de la forme <tag attr=XXX>texte</tag>
        $testHTML = preg_match('/<[^>]+>/', $string);

        // Pas de code de la forme [tag attr=XXX]
        $testTag= preg_match('/[[^>]+]/', $string);

        // pas de lien commençant par http://…
        $testURL = strstr($string, 'http://');
        // pas de lien commençant par https://…
        $testURLSSL = strstr($string, 'https://');

        if(($testHTML || $testTag) || $testURL || $testURLSSL ){
          return true;
        }
        return false;
    }
    
    /**
     * @Route("/new", name="contact_new", methods={"GET","POST"})
     */    
    public function contactMail(Request $request, MailerInterface $mailer, TranslatorInterface $translator, LoggerInterface $logger, AntiBots $antibots): Response
    {
        $checkTime = true;
        $newContact = new Contact();
        $form = $this->createForm(ContactType::class, $newContact);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $sendContact = true;
            $username = $firstName = $form->get('firstname')->getData();
            $lastName = $form->get('lastname')->getData();
            $email = $form->get('email')->getData();
            $content = $form->get('content')->getData();

            if($this->detectTags($content) && is_null($this->getUser()) ){
                $sendContact = false;
                $this->addFlash('error', 'contact.spam_tag_detected');
            }
            if( !is_null($this->getUser()) ){
                $username = "Camper connected : ".$this->getUser()->getFirstname()." ".$this->getUser()->getLastname();
            }
            $token = $request->request->get('contact')['_token'];

            //~ AntiBots
            if($_SERVER['ANTI_SPAM']){
                $referer = $request->get('_target_path');
                $checkReferer = $antibots->checkReferer($referer);
                $time = $request->get('_checkT');

                if($time <= $_SERVER['TIME_NOT_BOT']){
                    $checkTime = false;
                }

                if($checkReferer == false || $checkTime == false){
                    $logger->error("Problème pour contacter la team via le formulaire, ce camper est pris.e pour un.e bot.e : ");

                    $this->addFlash('error', 'contact.spam_detected');
                    return $this->redirectToRoute('contact_new');
                }
            }

            if($_SERVER['SEND_LOG_SPAM'] || ($checkReferer == false || $checkTime == false) ){
                $emailLogAdmin = (new TemplatedEmail())
                    ->from(new Address('share@garden-exchange.org', 'Garden Exchange Tech Mail'))
                    ->to(new Address('tech@garden-exchange.org', 'Garden Exchange Tech Mail'))
                    //->cc('cc@example.com')
                    //->replyTo('fabien@example.com')
                    //->priority(Email::PRIORITY_HIGH)
                    ->subject($translator->trans('email.new.message.admin'))
                    // path of the Twig template to render
                    ->htmlTemplate('emails/admin/new_contact_admin.html.twig')

                    // pass variables (name => value) to the template
                    ->context([
                        'expiration_date' => new \DateTime('+7 days'),
                        'username' => $username,
                        'firstName' => $firstName,
                        'lastName' => $lastName,
                        'emailContact' => $email,
                        'content' => $content,
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


            if($sendContact){
                // Stocker en bdd
                $em = $this->getDoctrine()->getManager();
                $em->persist($newContact);
                $em->flush();
                
                // envoi du message
                $emailNewContact = (new TemplatedEmail())
                    ->from(new Address('share@garden-exchange.org', 'Garden Exchange'))
                    ->to('share@garden-exchange.org')
                    //~ ->cc($email)
                    //->bcc('bcc@example.com')
                    //->replyTo('fabien@example.com')
                    //->priority(Email::PRIORITY_HIGH)
                    ->subject($translator->trans('email.new.message.admin'))
                    ->htmlTemplate('emails/new_contact.html.twig')
                    // pass variables (name => value) to the template
                    ->context([
                        'username' => $username,
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
            else{
                $this->addFlash('error', 'contact.spam_detected');
                return $this->redirectToRoute('contact_new');
            }
        }

        return $this->render('contact/contact_mail.html.twig', [
            'contactForm' => $form->createView(),
        ]);
    }

}
