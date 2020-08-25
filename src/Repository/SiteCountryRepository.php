<?php

namespace App\Repository;

use App\Entity\SiteCountry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SiteCountry|null find($id, $lockMode = null, $lockVersion = null)
 * @method SiteCountry|null findOneBy(array $criteria, array $orderBy = null)
 * @method SiteCountry[]    findAll()
 * @method SiteCountry[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SiteCountryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SiteCountry::class);
    }

    // /**
    //  * @return SiteCountry[] Returns an array of SiteCountry objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?SiteCountry
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
