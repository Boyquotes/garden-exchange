<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Form\Type;

use App\Entity\Equipment    ;
use App\Form\DataTransformer\EquipmentArrayToStringTransformer;
use App\Repository\EquipmentRepository;

use Symfony\Bridge\Doctrine\Form\DataTransformer\CollectionToArrayTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

/**
 * Defines the custom form field type used to manipulate equipments values across
 * Bootstrap-tagsinput javascript plugin.
 *
 * See https://symfony.com/doc/current/form/create_custom_field_type.html
 *
 * @author Yonel Ceruto <yonelceruto@gmail.com>
 */
class EquipmentsGardenType extends AbstractType
{
    private $equipments;

    public function __construct(EquipmentRepository $equipments)
    {
        $this->equipments = $equipments;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('equipment', ChoiceType::class, [
                'class'       => 'App\Entity\Equipment',
                'placeholder' => '',
            ])
        ;
    
        //~ $builder->addEventListener(
            //~ FormEvents::PRE_SET_DATA,
            //~ function (FormEvent $event) use ($formModifier) {
                //~ // this would be your entity, i.e. SportMeetup
                //~ $data = $event->getData();

                //~ $formModifier($event->getForm(), $data->getSport());
            //~ }
        //~ );

        //~ $builder->get('sport')->addEventListener(
            //~ FormEvents::POST_SUBMIT,
            //~ function (FormEvent $event) use ($formModifier) {
                //~ // It's important here to fetch $event->getForm()->getData(), as
                //~ // $event->getData() will get you the client data (that is, the ID)
                //~ $sport = $event->getForm()->getData();

                //~ // since we've added the listener to the child, we'll have to pass on
                //~ // the parent to the callback functions!
                //~ $formModifier($event->getForm()->getParent(), $sport);
            //~ }
        //~ );
    //~ }
        //~ $builder
            // The Equipment collection must be transformed into a comma separated string.
            // We could create a custom transformer to do Collection <-> string in one step,
            // but here we're doing the transformation in two steps (Collection <-> array <-> string)
            // and reuse the existing CollectionToArrayTransformer.
            //~ ->addModelTransformer(new CollectionToArrayTransformer(), true)
            //~ ->addModelTransformer(new EquipmentArrayToStringTransformer($this->equipments), true)
        //~ ;
    }

    /**
     * {@inheritdoc}
     */
    //~ public function buildView(FormView $view, FormInterface $form, array $options): void
    //~ {
        //~ $view->vars['equipments'] = $this->equipments->findAll();
    //~ }

    /**
     * {@inheritdoc}
     */
    //~ public function getParent()
    //~ {
        //~ return TextType::class;
    //~ }
}
