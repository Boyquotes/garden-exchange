<?php

namespace App\Controller;

use App\Entity\MessageExchange;
use App\Entity\ConversationExchange;
use App\Form\MessageExchangeType;
use App\Repository\MessageExchangeRepository;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 *
 * @Route("/admin/garden/message/exchange")
 * @IsGranted("ROLE_CAMPER")
 *
 * @author Boyquotes
 */
class MessageExchangeController extends AbstractController
{
    /**
     * @Route("/", name="message_exchange_index", methods={"GET"})
     */
    public function index(MessageExchangeRepository $messageExchangeRepository): Response
    {
        return $this->render('message_exchange/index_conversation.html.twig', [
            'message_exchanges' => $messageExchangeRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new/{conversation}", name="message_exchange_new", methods={"GET","POST"})
     */
    public function new(Request $request, ConversationExchange $conversation): Response
    {
        $messageExchange = new MessageExchange();
        $form = $this->createForm(MessageExchangeType::class, $messageExchange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $messageExchange->setConversationExchange($conversation);
            $messageExchange->setUser($this->getUser());
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($messageExchange);
            $entityManager->flush();

            return $this->redirectToRoute('conversation_exchange_show', [
                'id' => $conversation->getId(),
            ]);
        }

        return $this->render('message_exchange/new.html.twig', [
            'message_exchange' => $messageExchange,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="message_exchange_show", methods={"GET"})
     */
    public function show(MessageExchange $messageExchange): Response
    {
        return $this->render('message_exchange/show.html.twig', [
            'message_exchange' => $messageExchange,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="message_exchange_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, MessageExchange $messageExchange): Response
    {
        $form = $this->createForm(MessageExchangeType::class, $messageExchange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('message_exchange_index');
        }

        return $this->render('message_exchange/edit.html.twig', [
            'message_exchange' => $messageExchange,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="message_exchange_delete", methods={"DELETE"})
     */
    public function delete(Request $request, MessageExchange $messageExchange): Response
    {
        if ($this->isCsrfTokenValid('delete'.$messageExchange->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($messageExchange);
            $entityManager->flush();
        }

        return $this->redirectToRoute('message_exchange_index');
    }
}
