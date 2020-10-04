<?php
namespace App\Form;

use App\Entity\CampingType;
use App\Entity\Country;
use App\Entity\Profile;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

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
                        ->addOrderBy('c.orderForm', 'ASC')
                        ->addOrderBy('c.enabled', 'DESC');
                },
                'choice_label' => 'lang_fr',
                'required' => true,
                'group_by' => function($choice, $key, $value) {
                    if( $choice->getOrderForm() > 0 ) {
                        return 'Europe';
                    }
                    return 'Monde';
                },
            ])
            ->add('telephone', TelType::class, [
                'label' => 'label.telephone',
            ])
            ->add('campingTypes', EntityType::class, [
                'label' => 'label.profil.campingTypes',
                'class' => CampingType::class,
                'choice_label' => 'name',
                'multiple' => true,
                'required' => true,
            ])
            ->add('description', null, [
                'attr' => ['rows' => 20],
                'empty_data' => '',
                'help' => 'help.profil_description',
                'label' => 'label.profil.description',
            ])
            ->add('langs', ChoiceType::class, [
                'choices' => [
                    'fr' => 'fr',
                    'en' => 'en',
                    'de' => 'de',
                    'es' => 'es',
                    'pt' => 'pt',
                    'it' => 'it',
                ],
                'expanded'  => true,
                'multiple'  => true,
                'label' => 'label.profil.langs',
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
            'validation_groups' => false,
        ]);
    }
}
