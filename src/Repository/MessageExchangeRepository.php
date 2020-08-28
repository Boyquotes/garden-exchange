<?php

namespace App\Repository;

use App\Entity\MessageExchange;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method MessageExchange|null find($id, $lockMode = null, $lockVersion = null)
 * @method MessageExchange|null findOneBy(array $criteria, array $orderBy = null)
 * @method MessageExchange[]    findAll()
 * @method MessageExchange[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageExchangeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MessageExchange::class);
    }

    // /**
    //  * @return MessageExchange[] Returns an array of MessageExchange objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?MessageExchange
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
