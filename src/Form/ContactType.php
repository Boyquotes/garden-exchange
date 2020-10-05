<?php
namespace App\Form;

use App\Entity\Contact;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class ContactType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstname', TextType::class, [
                'label' => 'label.firstname',
                'empty_data' => '',
                'constraints' => [
                    new NotBlank(),
                ],
            ])
            ->add('lastname', TextType::class, [
                'label' => 'label.lastname',
                'empty_data' => '',
                'constraints' => [
                    new NotBlank(),
                ],
            ])
            ->add('email', EmailType::class, [
                'label' => 'label.email',
                'empty_data' => '',
                'constraints' => [
                    new NotBlank(),
                ],
            ])
            ->add('content', TextareaType::class, [
                'label' => 'label.message',
                'empty_data' => '',
                'constraints' => [
                    new NotBlank(),
                ],
            ])
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Contact::class,
        ]);
    }
}
