<?php
namespace App\Controller;

use App\Form\Type\SimpleSearchType;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SearchController extends AbstractController
{

    public function searchWidgetSimple(Request $request): Response
    {
        
        $form = $this->createForm(SimpleSearchType::class);
        $form->handleRequest($request);
        dump($form);
        return $this->render('search/form/_search_widget_simple.html.twig', [
            'searchForm' => $form->createView(),
        ]);
    }

}
