<?php
namespace App\Form;

use App\Entity\CampingType;
use App\Entity\Country;
use App\Entity\Garden;
use App\Entity\GardenImage;
use App\Entity\Equipment;
use App\Entity\Rule;
use App\Form\Type\DateTimePickerType;


use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Positive;

class GardenType extends AbstractType
{
    private $slugger;

    // Form types are services, so you can inject other services in them if needed
    //~ public function __construct(EntityManagerInterface $em, SluggerInterface $slugger, EquipmentArrayToStringTransformer $transformer)
    public function __construct(EntityManagerInterface $em, SluggerInterface $slugger)
    {
        $this->entityManager = $em;
        $this->slugger = $slugger;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // For the full reference of options defined by each form field type
        // see https://symfony.com/doc/current/reference/forms/types.html

        // By default, form fields include the 'required' attribute, which enables
        // the client-side form validation. This means that you can't test the
        // server-side validation errors from the browser. To temporarily disable
        // this validation, set the 'required' attribute to 'false':
        // $builder->add('title', null, ['required' => false, ...]);

        $builder
            ->add('description', null, [
                'attr' => ['rows' => 20],
                'help' => 'help.garden_description',
                'label' => 'label.description',
                'constraints' => [
                    new Length([
                        'min' => 50,
                        'max' => 10000,
                    ]),
                ],
            ])
            ->add('street', null, [
                'label' => 'label.street',
            ])
            ->add('area', null, [
                'help' => 'help.garden_area',
                'label' => 'label.area',
                'constraints' => [
                    new Positive(),
                ],
            ])
            ->add('postcode', null, [
                'attr' => [],
                'label' => 'label.postcode',
                'constraints' => [
                    new NotBlank(),
                ],
            ])
            ->add('city', null, [
                'attr' => [],
                'label' => 'label.city',
            ])
            ->add('lat', HiddenType::class, [
                'attr' => [],
                'label' => 'label.lat',
            ])
            ->add('lng', HiddenType::class, [
                'attr' => [],
                'label' => 'label.lng',
            ])
            
            ->add('campingTypes', EntityType::class, [
                'label' => 'label.campingTypes',
                'class' => CampingType::class,
                'choice_label' => 'name',
                'multiple' => true,
                'required' => true,
            ])
            
            ->add('equipments', EntityType::class, [
                'label' => 'label.equipments',
                'class' => Equipment::class,
                'choice_label' => 'name',
                'multiple' => true,
                'required' => false,
            ])

            ->add('rules', EntityType::class, [
                'label' => 'label.rules',
                'class' => Rule::class,
                'choice_label' => 'name',
                'multiple' => true,
                'required' => false,
            ])

            ->add('country', EntityType::class, [
                'label' => 'label.country',
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
            
            ->add('gardenImages', FileType::class,[
                'attr' => ['class' => 'inputfile', 'placeholder' => 'label.addPhotos'],
                'label' => 'label.photos',
                'help' => 'help.garden.photo',
                'multiple' => true,
                'mapped' => false,
                'required' => false
            ])
            ->addEventListener(FormEvents::SUBMIT, function (FormEvent $event) {
                /** @var Garden */
                $garden = $event->getData();
            })
        ;


    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Garden::class,
        ]);
    }
}
