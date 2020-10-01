<?php
namespace App\Logger;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ClientIpProcessor
{
    private $requestStack;
    private $cachedClientIp = null;
    
    public function __construct(RequestStack $requestStack, TokenStorageInterface $securityToken)
    {
        $this->requestStack = $requestStack;
        $this->securityToken = $securityToken;
    }
    
    public function __invoke(array $record)
    {
        //~ dump($_SERVER['HTTP_USER_AGENT']);
        
        //~ dump($this->securityToken->getToken()->getUser());
        //~ exit;
        // request_ip will hold our proxy server's IP
        $record['extra']['request_ip'] = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unavailable';
        // client_ip will hold the request's actual origin address
        $record['extra']['client_ip']  = $this->cachedClientIp          ? $this->cachedClientIp   : 'unavailable';
        $record['extra']['user_agent']  = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'user agent unavailable';
        
        // Return if we already know client's IP
        if ($record['extra']['client_ip'] !== 'unavailable') {
            return $record;
        }
        
        // Ensure we have a request (maybe we're in a console command)
        if (! $request = $this->requestStack->getCurrentRequest()) {
            return $record;
        }
        
        // If we do, get the client's IP, and cache it for later.
        $this->cachedClientIp = $request->getClientIp();
        $record['extra']['client_ip'] = $this->cachedClientIp;
        
        return $record;
    }
}
