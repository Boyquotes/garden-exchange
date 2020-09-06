<?php

namespace App\Form;

use App\Entity\ConversationExchange;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class ConversationExchangeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('host',  HiddenType::class,[
                'required' => false
            ])
            ->add('content', TextareaType::class, [
                'constraints' => [
                    new NotBlank(),
                    new Length([
                        'min' => 50,
                        'max' => 10000,
                    ]),
                ],
            ],
            );
//            ->add('users',User::class,[ 'label' => 'label.tags',
 //               'required' => false
//            ]);
    }
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ConversationExchange::class,
            //~ 'validation_groups' => false,   
        ]);
    }
}
