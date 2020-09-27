<?php
namespace App\Repository;

use App\Entity\Garden;
use App\Entity\Tag;
use App\Pagination\Paginator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use function Symfony\Component\String\u;

class GardenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Garden::class);
    }

    public function findAllGardensEnabled()
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.enabled = :val')
            ->setParameter('val', 1)
            ->getQuery()
            ->getResult()
        ;
    }

}
