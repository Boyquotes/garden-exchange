<?php
namespace App\Form;

use App\Entity\Country;
use App\Entity\Profile;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProfileType extends AbstractType
{
    
    
    public function __construct(EntityManagerInterface $em)
    {
        $this->entityManager = $em;
    }
    
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('street', TextType::class, [
                'label' => 'label.street',
            ])
            ->add('postcode', IntegerType::class, [
                'label' => 'label.postcode',
            ])
            ->add('city', TextType::class, [
                'label' => 'label.city',
            ])
            ->add('countryResidence', EntityType::class, [
                'label' => 'label.country.residence',
                'class' => Country::class,
                'query_builder' => function (EntityRepository $er) {
                    return $er->createQueryBuilder('c')
                        ->orderBy('c.enabled', 'DESC');
                },
                'choice_label' => 'lang_fr',
                'required' => true,
                'group_by' => function($choice, $key, $value) {
                    if( $choice->getEnabled() > 0 ) {
                        return 'Europe';
                    }
                    return 'Monde';
                },
            ])
            ->add('telephone', IntegerType::class, [
                'label' => 'label.telephone',
            ])
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Profile::class,
        ]);
    }
}
