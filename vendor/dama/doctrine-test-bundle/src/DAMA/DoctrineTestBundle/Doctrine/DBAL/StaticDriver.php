<?php

namespace DAMA\DoctrineTestBundle\Doctrine\DBAL;

if (interface_exists(\Doctrine\DBAL\Driver\ExceptionConverterDriver::class)) {
    // dbal v2
    class StaticDriver extends AbstractStaticDriverV2
    {
    }
} else {
    // dbal v3
    class StaticDriver extends AbstractStaticDriverV3
    {
    }
}
