<?php
namespace App\Security;

use App\Entity\Garden;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;

class GardenVoter extends Voter
{
    public const VIEW = 'view';
    public const DELETE = 'delete';
    public const EDIT = 'edit';
    
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * {@inheritdoc}
     */
    protected function supports($attribute, $subject): bool
    {
        // this voter is only executed for three specific permissions on Garden objects
        return $subject instanceof Garden && \in_array($attribute, [self::VIEW, self::EDIT, self::DELETE], true);
    }

    /**
     * {@inheritdoc}
     */
    protected function voteOnAttribute($attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if ($this->security->isGranted('ROLE_ADMIN')) {
            return true;
        }

        // the user must be logged in; if not, deny permission
        if (!$user instanceof User) {
            return false;
        }
        $garden = $subject;

        switch ($attribute) {
            case self::VIEW:
                return $this->canView($garden, $user);
            case self::EDIT:
                return $this->canEdit($garden, $user);
            case self::DELETE:
                return $this->canDelete($garden, $user);
        }

        throw new \LogicException('This Voter code should not be reached!');
    }
    
    private function canView(Garden $garden, User $user)
    {
        if ($this->security->isGranted('ROLE_CAMPER')) {
            return true;
        }

        return false;
    }

    private function canEdit(Garden $garden, User $user)
    {
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return true;
        }
        
        // if they can't view, they can't edit
        if (! $this->canView($garden, $user)) {
            return false;
        }

        if ($this->security->isGranted('ROLE_CAMPER') && $user === $garden->getUser()) {
            return true;
        }
        
        return false;
    }
    
    private function canDelete(Garden $garden, User $user)
    {
        // if they can't edit, they can't delete
        if ($this->canEdit($garden, $user)) {
            return true;
        }
        
        return false;
    }
    
}
