<?php
namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;

class UserVoter extends Voter
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
        // this voter is only executed for three specific permissions on User objects
        return $subject instanceof User && \in_array($attribute, [self::VIEW, self::EDIT, self::DELETE], true);
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


        switch ($attribute) {
            case self::VIEW:
                return $this->canView($user);
            case self::EDIT:
                return $this->canEdit($user);
            case self::DELETE:
                return $this->canDelete($user);
        }

        throw new \LogicException('This Voter code should not be reached!');
    }
    
    private function canView(User $user)
    {
        if ($this->security->isGranted('ROLE_CAMPER')) {
            return true;
        }

        return false;
    }

    private function canEdit(User $user)
    {
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return true;
        }
        
        // if they can't view, they can't edit
        if (! $this->canView($user)) {
            return false;
        }

        //~ if ($this->security->isGranted('ROLE_CAMPER') && $user === $user) {
            //~ return true;
        //~ }
        
        return false;
    }
    
    private function canDelete(User $user)
    {
        // if they can't edit, they can't delete
        if ($this->canEdit($user)) {
            return true;
        }
        
        return false;
    }
    
}
