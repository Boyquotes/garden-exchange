<?php

namespace App\Repository;

use App\Entity\CampingType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CampingType|null find($id, $lockMode = null, $lockVersion = null)
 * @method CampingType|null findOneBy(array $criteria, array $orderBy = null)
 * @method CampingType[]    findAll()
 * @method CampingType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CampingTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CampingType::class);
    }

}
