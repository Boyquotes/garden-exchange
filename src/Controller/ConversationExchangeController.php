<?php

namespace App\Controller;

use App\Entity\ConversationExchange;
use App\Entity\Garden;
use App\Entity\User;
use App\Form\ConversationExchangeType;
use App\Repository\ConversationExchangeRepository;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
    public function index(ConversationExchangeRepository $conversationExchangeRepository): Response
    {
        return $this->render('conversation_exchange/index_conversation.html.twig', [
            'conversation_exchanges' => $conversationExchangeRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new/{userId}/garden/{gardenId}", name="conversation_exchange_new", methods={"GET","POST"})
     * @ParamConverter("garden", options={"mapping": {"gardenId" : "id"}})
     */
    public function new(Request $request, User $userId, Garden $garden): Response
    {
        $conversationExchange = new ConversationExchange();
        $form = $this->createForm(ConversationExchangeType::class, $conversationExchange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
        $conversationExchange->addUser($userId);
        $conversationExchange->addUser($this->getUser());
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($conversationExchange);
            $entityManager->flush();

            return $this->redirectToRoute('conversation_exchange_index');
        }

        return $this->render('conversation_exchange/new_conversation.html.twig', [
            'conversation_exchange' => $conversationExchange,
            'garden' => $garden ,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="conversation_exchange_show", methods={"GET"})
     */
    public function show(ConversationExchange $conversationExchange): Response
    {
        return $this->render('conversation_exchange/show_conversation.html.twig', [
            'conversation_exchange' => $conversationExchange,
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

        return $this->render('conversation_exchange/edit.html.twig', [
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
