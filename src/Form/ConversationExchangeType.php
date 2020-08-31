<?php

namespace App\Form;

use App\Entity\ConversationExchange;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ConversationExchangeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            //~ ->add('title')
            ->add('content');
//            ->add('users',User::class,[ 'label' => 'label.tags',
 //               'required' => false
//            ]);
    }
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ConversationExchange::class,
        ]);
    }
}
