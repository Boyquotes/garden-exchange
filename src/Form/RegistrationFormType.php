<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('lastname', TextType::class, [
                'label' => 'label.lastname',
                'help' => 'help.lastname',
                'constraints' => [
                    new NotBlank(),
                ],
            ])
            ->add('firstname', TextType::class, [
                'label' => 'label.firstname',
                'constraints' => [
                    new NotBlank(),
                ],
            ])
            ->add('email', EmailType::class, [
                'label' => 'label.email',
            ])
            ->add('agreeTerms', CheckboxType::class, [
                'mapped' => false,
                'label' => false,
                'constraints' => [
                    new IsTrue([
                        'message' => 'You should agree to our terms.',
                    ]),
                ],
            ])
            //~ ->add('password', PasswordType::class, [
                //~ // instead of being set onto the object directly,
                //~ // this is read and encoded in the controller
                //~ 'mapped' => false,
                //~ 'constraints' => [
                    //~ new NotBlank([
                        //~ 'message' => 'Please enter a password',
                    //~ ]),
                    //~ new Length([
                        //~ 'min' => 6,
                        //~ 'minMessage' => 'Your password should be at least {{ limit }} characters',
                        //~ // max length allowed by Symfony for security reasons
                        //~ 'max' => 4096,
                    //~ ]),
                //~ ],
            //~ ])
            ->add('password', PasswordType::class, [
                'label' => 'label.password',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
