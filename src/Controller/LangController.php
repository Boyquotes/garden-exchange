<?php
namespace App\Controller;

use App\Repository\CountryRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LangController extends AbstractController
{

    public function langSelector(Request $request, CountryRepository $countries): Response
    {
        $langs = $countries->findAllEnabled();
        
        return $this->render('lang/_lang_selector.html.twig', [
            'langs' => $langs,
        ]);
    }

}
