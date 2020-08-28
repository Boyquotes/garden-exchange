<?php

namespace App\Repository;

use App\Entity\GardenZone;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method GardenZone|null find($id, $lockMode = null, $lockVersion = null)
 * @method GardenZone|null findOneBy(array $criteria, array $orderBy = null)
 * @method GardenZone[]    findAll()
 * @method GardenZone[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GardenZoneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GardenZone::class);
    }

    // /**
    //  * @return GardenZone[] Returns an array of GardenZone objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('g.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?GardenZone
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
