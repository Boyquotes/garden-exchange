<?php
namespace App\Controller;

use App\Entity\Comment;
use App\Entity\Post;
use App\Events\CommentCreatedEvent;
use App\Form\CommentType;
use App\Form\Type\SimpleSearchType;
use App\Repository\CountryRepository;
use App\Repository\GardenRepository;
use App\Repository\PostRepository;
use App\Repository\TagRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/results")
 *
 */
class ResultController extends AbstractController
{
    
    /**
     * @Route("/", name="garden_results", methods={"GET", "POST"})
     */
    public function gardensListing(Request $request, CountryRepository $countries, GardenRepository $gardens): Response
    {
        $allGardens = $gardens->findAllGardensEnabled();
        $langs = $countries->findAllCountriesEnabled();
        $where = '';
        
        $form = $this->createForm(SimpleSearchType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $where = $request->get('where');
        }

        return $this->render('results/gardens.html.twig', [
            'allGardens' => $allGardens,
            'langs' => $langs,
            'searchForm' => $form->createView(),
            'where' => $where,
        ]);
    }

}
