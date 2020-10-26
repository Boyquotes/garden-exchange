<?php
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

class GardenImageType extends AbstractType
{
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
            ->add('libelle', null, [
                'attr' => [],
                'label' => 'label.libelle',
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
            'data_class' => GardenImage::class,
        ]);
    }
}
