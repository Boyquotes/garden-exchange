<?php
namespace App\Form\Type;

use App\Form\UserType;
use App\Form\ProfileType;
use App\Repository\ProfileRepository;

use Symfony\Bridge\Doctrine\Form\DataTransformer\CollectionToArrayTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

class UserProfileType extends AbstractType
{
    private $profiles;

    //~ public function __construct(ProfileRepository $profiles)
    //~ {
        //~ $this->profiles = $profiles;
    //~ }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('user', UserType::class)
            ->add('profile', ProfileType::class)
        ;
    }

}
