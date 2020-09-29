<?php

namespace App\Logger;

use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SessionRequestProcessor
{
    private $session;
    private $sessionId;
    private $tokenStorage;
    private $user;

    public function __construct(SessionInterface $session, TokenStorageInterface $tokenStorage)
    {
        $this->session = $session;
        $this->tokenStorage = $tokenStorage;
        if($tokenStorage->getToken()){
            $this->user = $tokenStorage->getToken()->getUser();
        }
    }

    // this method is called for each log record; optimize it to not hurt performance
    public function __invoke(array $record)
    {
        
        //~ dump($this->session->getId());
        //~ dump($this->securityToken);

        
        if (!$this->session->isStarted()) {
            return $record;
        }

        if (!$this->sessionId) {
            $this->sessionId = substr($this->session->getId(), 0, 8) ?: '????????';
        }

        $record['extra']['token'] = $this->sessionId.'-'.substr(uniqid('', true), -8);

        if (null !== $this->user && $this->user instanceof User) {
            $record['extra']['user'] = $this->user->getUsername();
        }

        return $record;
    }
    
    public function onKernelRequest($event)
    {
        if (null === $token = $this->tokenStorage->getToken()) {
            return;
        }

        if (!is_object($user = $token->getUser())) {
            // e.g. anonymous authentication
            return;
        }

        $this->user = $user;
    }
    
}
