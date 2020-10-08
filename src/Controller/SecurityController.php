<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Util\TargetPathTrait;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Cookie;

class SecurityController extends AbstractController
{
    use TargetPathTrait;

    /**
     * @Route("/login", name="security_login")
     */
    public function login(Request $request, Security $security, AuthenticationUtils $helper, TokenStorageInterface $securityToken): Response
    {
        $request->getSession()->clear();
        $response = new Response($this->render('security/login.html.twig', [
            // last email entered by the user (if any)
            'last_username' => $helper->getLastUsername(),
            // last authentication error (if any)
            'error' => $helper->getLastAuthenticationError(),
        ]));
        //~ $response->headers->clearCookie('PHPSESSID');
        //~ $response->headers->setCookie(new Cookie('PHPSESSID'));
        // if user is already logged in, don't display the login page again
        //~ if ($security->isGranted('ROLE_CAMPER')) {
            //~ return $this->redirectToRoute('admin_index');
        //~ }
//~ dump($request->request->get('token'));
        // this statement solves an edge-case: if you change the locale in the login
        // page, after a successful login you are redirected to a page in the previous
        // locale. This code regenerates the referrer URL whenever the login page is
        // browsed, to ensure that its locale is always the current one.
        $this->saveTargetPath($request->getSession(), 'main', $this->generateUrl('admin_index'));

        return $response->send();
        //~ return $this->render('security/login.html.twig', [
            //~ // last email entered by the user (if any)
            //~ 'last_username' => $helper->getLastUsername(),
            //~ // last authentication error (if any)
            //~ 'error' => $helper->getLastAuthenticationError(),
        //~ ]);
    }

    /**
     * This is the route the user can use to logout.
     *
     * But, this will never be executed. Symfony will intercept this first
     * and handle the logout automatically. See logout in config/packages/security.yaml
     *
     * @Route("/logout", name="security_logout")
     */
    public function logout(): void
    {
        throw new \Exception('This should never be reached!');
    }
}
