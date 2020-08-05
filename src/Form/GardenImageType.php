<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Form;

use App\Entity\GardenImage;
use App\Entity\Equipment;
use App\Form\Type\DateTimePickerType;
use App\Form\Type\TagsInputType;
use App\Form\EquipmentType;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\String\Slugger\SluggerInterface;

class GardenImageType extends AbstractType
{
    private $slugger;

    // Form types are services, so you can inject other services in them if needed
    public function __construct(SluggerInterface $slugger)
    {
        $this->slugger = $slugger;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', FileType::class,[
                'label' => false,
                'multiple' => true,
                'mapped' => false,
                'required' => false
            ])
            //~ ->add('gardenImages' , CollectionType::class, [
                    //~ 'entry_type' => GardenImageType::class,
                    //~ 'allow_add' => true,
                    //~ 'by_reference' => false,
            //~ ])
            
            //~ ->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
                //~ $form = $event->getForm();

                //~ $formOptions = [
                    //~ 'class' => Equipment::class,
                    //~ 'choice_label' => 'name',
                    //~ 'query_builder' => function (EquipmentRepository $EquipmentRepository) {
                        //~ $EquipmentRepository->findTous();
                    //~ },
                //~ ];

                //~ // create the field, this is similar the $builder->add()
                //~ // field name, field type, field options
                //~ $form->add('equipmentsGarden', EntityType::class, $formOptions);
            //~ })
            // form events let you modify information or fields at different steps
            // of the form handling process.
            // See https://symfony.com/doc/current/form/events.html
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
            'data_class' => GardenImage::class,
            //~ 'equipments' => []
        ]);
    }
}
