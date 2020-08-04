<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Form\DataTransformer;

use App\Entity\Equipment;
use App\Repository\EquipmentRepository;
use Symfony\Component\Form\DataTransformerInterface;
use function Symfony\Component\String\u;

/**
 * This data transformer is used to translate the array of equipments into a comma separated format
 * that can be displayed and managed by Bootstrap-tagsinput js plugin (and back on submit).
 *
 * See https://symfony.com/doc/current/form/data_transformers.html
 *
 * @author Yonel Ceruto <yonelceruto@gmail.com>
 * @author Jonathan Boyer <contact@grafikart.fr>
 */
class EquipmentArrayToStringTransformer implements DataTransformerInterface
{
    private $equipments;

    public function __construct(EquipmentRepository $equipments)
    {
        $this->equipments = $equipments;
    }

    /**
     * {@inheritdoc}
     */
    public function transform($equipments): string
    {
        // The value received is an array of Equipment objects generated with
        // Symfony\Bridge\Doctrine\Form\DataTransformer\CollectionToArrayTransformer::transform()
        // The value returned is a string that concatenates the string representation of those objects

        /* @var Equipments[] $equipments */
        return implode(',', $equipments);
    }

    /**
     * {@inheritdoc}
     */
    public function reverseTransform($string): array
    {
        if (null === $string || u($string)->isEmpty()) {
            return [];
        }

        $names = array_filter(array_unique(array_map('trim', u($string)->split(','))));

        // Get the current equipments and find the new ones that should be created.
        $equipments = $this->equipments->findBy([
            'name' => $names,
        ]);
        $newNames = array_diff($names, $equipments);
        foreach ($newNames as $name) {
            $equipment = new Equipment();
            $equipment->setName($name);
            $equipments[] = $equipment;

            // There's no need to persist these new equipments because Doctrine does that automatically
            // thanks to the cascade={"persist"} option in the App\Entity\Post::$equipments property.
        }

        // Return an array of equipments to transform them back into a Doctrine Collection.
        // See Symfony\Bridge\Doctrine\Form\DataTransformer\CollectionToArrayTransformer::reverseTransform()
        return $equipments;
    }
}
