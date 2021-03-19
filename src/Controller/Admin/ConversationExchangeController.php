<?php

namespace App\Controller\Admin;

use App\Entity\ConversationExchange;
use App\Entity\MessageExchange;
use App\Entity\Garden;
use App\Entity\User;
use App\Form\ConversationExchangeType;
use App\Form\MessageExchangeType;
use App\Repository\ConversationExchangeRepository;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 *
 * @Route("/admin/conversation/exchange")
 * @IsGranted("ROLE_CAMPER")
 *
 * @author Boyquotes
 */
class ConversationExchangeController extends AbstractController
{
    /**
     * @Route("/", name="conversation_exchange_index", methods={"GET"})
     */
    public function index(Security $security, ConversationExchangeRepository $conversationExchangeRepository): Response
    {
        if ($security->isGranted('ROLE_ADMIN')) {
            $conversations = $conversationExchangeRepository->findBy(array(), array('created' => 'DESC'));
        }
        else{
            $conversationsHost = $conversationExchangeRepository->findByHost($this->getUser());
            $conversationsCamper = $conversationExchangeRepository->findByCamper($this->getUser());
            $conversations = array_merge($conversationsHost, $conversationsCamper);
        }

        return $this->render('admin/conversation_exchange/index_conversation.html.twig', [
            'conversation_exchanges' => $conversations,
        ]);
    }

    /**
     * @Route("/new/{userId}/garden/{gardenId}", name="conversation_exchange_new", methods={"GET","POST"})
     * @ParamConverter("garden", options={"mapping": {"gardenId" : "id"}})
     * @ParamConverter("user", options={"mapping": {"userId" : "id"}})
     */
    public function new(Request $request, MailerInterface $mailer, TranslatorInterface $translator, User $user, Garden $garden): Response
    {
        if($user == $this->getUser()){
            $this->addFlash('success', 'conversation.new.warning.you.talking.to.you');
            return $this->redirectToRoute('conversation_exchange_index');
        }
        
        $conversationExchange = new ConversationExchange();
        $form = $this->createForm(ConversationExchangeType::class, $conversationExchange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $conversationExchange->setHost($user);
            $conversationExchange->setCamper($this->getUser());
            $conversationExchange->setGarden($garden);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($conversationExchange);
            $entityManager->flush();

            $email = $user->getEmail();
            $emailNewConversation = (new TemplatedEmail())
                ->from(new Address('share@garden-exchange.org', 'Garden Exchange'))
                ->to($email)
                //->cc('cc@example.com')
                //->bcc('bcc@example.com')
                //->replyTo('fabien@example.com')
                //->priority(Email::PRIORITY_HIGH)
                ->subject($translator->trans('email.new.conversation'))
                ->htmlTemplate('emails/new_conversation.html.twig')
                // pass variables (name => value) to the template
                ->context([
                    'garden' => $garden,
                    'username' => $user->getUsername(),
                ]);
            try {
                $mailer->send($emailNewConversation);
            } catch (TransportExceptionInterface $e) {
                // some error prevented the email sending; display an
                // error message or try to resend the message
            }

            return $this->redirectToRoute('conversation_exchange_index');
        }

        return $this->render('admin/conversation_exchange/new_conversation.html.twig', [
            'conversation_exchange' => $conversationExchange,
            'garden' => $garden ,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="conversation_exchange_show", methods={"GET", "POST"})
     */
    public function show(Request $request, MailerInterface $mailer, TranslatorInterface $translator, ConversationExchange $conversationExchange): Response
    {
        $messageExchange = New MessageExchange();
        $user = $this->getUser();
        $form = $this->createForm(MessageExchangeType::class, $messageExchange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $messageExchange->setConversationExchange($conversationExchange);
            $messageExchange->setUser($this->getUser());
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($messageExchange);
            $entityManager->flush();

            if( $conversationExchange->getHost()->getId() == $user->getId() ){
                $email = $conversationExchange->getCamper()->getEmail();
            }
            else{
                $email = $conversationExchange->getHost()->getEmail();
            }

            $emailNewMessage = (new TemplatedEmail())
                ->from(new Address('share@garden-exchange.org', 'Garden Exchange'))
                ->to($email)
                //->cc('cc@example.com')
                //->bcc('bcc@example.com')
                //->replyTo('fabien@example.com')
                //->priority(Email::PRIORITY_HIGH)
                ->subject($translator->trans('email.new.message'))
                ->htmlTemplate('emails/new_message.html.twig')
                // pass variables (name => value) to the template
                ->context([
                    'conversationExchange' => $conversationExchange,
                    'username' => $user->getUsername(),
                ]);
            try {
                $mailer->send($emailNewMessage);
            } catch (TransportExceptionInterface $e) {
                // some error prevented the email sending; display an
                // error message or try to resend the message
            }
            
            return $this->redirectToRoute('conversation_exchange_show', ['id' => $conversationExchange->getId()]);
        }

        return $this->render('admin/conversation_exchange/show_conversation.html.twig', [
            'conversation_exchange' => $conversationExchange,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}/edit", name="conversation_exchange_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, ConversationExchange $conversationExchange): Response
    {
        $form = $this->createForm(ConversationExchangeType::class, $conversationExchange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('conversation_exchange_index');
        }

        return $this->render('admin/conversation_exchange/edit.html.twig', [
            'conversation_exchange' => $conversationExchange,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="conversation_exchange_delete", methods={"DELETE"})
     */
    public function delete(Request $request, ConversationExchange $conversationExchange): Response
    {
        if ($this->isCsrfTokenValid('delete'.$conversationExchange->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($conversationExchange);
            $entityManager->flush();
        }

        return $this->redirectToRoute('conversation_exchange_index');
    }
    
    /**
     * @Route("/{conversationExchangeId}/accepted", name="garden_exchange_accepted", methods={"POST"})
     * @ParamConverter("conversationExchange", options={"mapping": {"conversationExchangeId" : "id"}})
     */
    public function deleteGardenImage(Request $request, ConversationExchange $conversationExchange){
        $token = $request->request->get('_token');

        if($this->isCsrfTokenValid('acceptedExchange'.$conversationExchange->getId(), $token)){
            $conversationExchange->setExchanged('1');
            $em = $this->getDoctrine()->getManager();
            $em->flush();

            return new JsonResponse(['success' => 1]);
        }else{
            return new JsonResponse(['error' => 'Token Invalid'], 400);
        }
    }
    
}
