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
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

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
            $conversations = $conversationExchangeRepository->findAll();
        }
        else{
            $conversations = $conversationExchangeRepository->findByHost($this->getUser());
        }
        
        dump($conversations);
        return $this->render('admin/conversation_exchange/index_conversation.html.twig', [
            'conversation_exchanges' => $conversations,
        ]);
    }

    /**
     * @Route("/new/{userId}/garden/{gardenId}", name="conversation_exchange_new", methods={"GET","POST"})
     * @ParamConverter("garden", options={"mapping": {"gardenId" : "id"}})
     * @ParamConverter("user", options={"mapping": {"userId" : "id"}})
     */
    public function new(Request $request, User $user, Garden $garden): Response
    {
        if($user == $this->getUser()){
            $this->addFlash('success', 'conversation.new.warning.you.talking.to.tou');
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
    public function show(Request $request, ConversationExchange $conversationExchange): Response
    {
        $messageExchange = New MessageExchange();
        $form = $this->createForm(MessageExchangeType::class, $messageExchange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $messageExchange->setConversationExchange($conversationExchange);
            $messageExchange->setUser($this->getUser());
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($messageExchange);
            $entityManager->flush();
            
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
}
