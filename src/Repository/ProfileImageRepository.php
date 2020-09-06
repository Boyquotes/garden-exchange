<?php

namespace App\Repository;

use App\Entity\ProfileImage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ProfileImage|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProfileImage|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProfileImage[]    findAll()
 * @method ProfileImage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProfileImageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProfileImage::class);
    }

    // /**
    //  * @return ProfileImage[] Returns an array of ProfileImage objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ProfileImage
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
