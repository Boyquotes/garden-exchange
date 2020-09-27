<?php
namespace App\Form\Type;

use Symfony\Bridge\Doctrine\Form\DataTransformer\CollectionToArrayTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

class SimpleSearchType extends AbstractType
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
            ->add('where', TextType::class, array(
                'label' => false,
                'attr' => array(
                    'placeholder' => 'label.search.where',
                )
            ))
        ;
    }

}
