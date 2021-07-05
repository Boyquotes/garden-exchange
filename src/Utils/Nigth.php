<?php
namespace App\Utils;

use App\Entity\ProfilNight;

use Doctrine\ORM\EntityManagerInterface;

class Nigth
{

    private $entityManager;

    public function __construct(EntityManagerInterface $em)
    {
        $this->entityManager = $em;
    }

    public function addProfilNight($user, $nbNigth, $type = null, $status = null)
    {
        //~ recup profil
        $profilNight = new ProfilNight;
        $profilNight->setUser($user);
        $profilNight->setType($type);
        $profilNight->setStatus($status);
        
        $this->entityManager->persist($profilNight);
        $this->entityManager->flush();
        //~ addnigth to  profil and flush
    }

}
