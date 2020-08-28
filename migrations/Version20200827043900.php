<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200827043900 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE garden_zone (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, information LONGTEXT DEFAULT NULL, picto VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE garden_zone_garden (garden_zone_id INT NOT NULL, garden_id INT NOT NULL, INDEX IDX_DF20546DEE9B3199 (garden_zone_id), INDEX IDX_DF20546D39F3B087 (garden_id), PRIMARY KEY(garden_zone_id, garden_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE garden_zone_garden ADD CONSTRAINT FK_DF20546DEE9B3199 FOREIGN KEY (garden_zone_id) REFERENCES garden_zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE garden_zone_garden ADD CONSTRAINT FK_DF20546D39F3B087 FOREIGN KEY (garden_id) REFERENCES garden (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE garden_zone_garden DROP FOREIGN KEY FK_DF20546DEE9B3199');
        $this->addSql('DROP TABLE garden_zone');
        $this->addSql('DROP TABLE garden_zone_garden');
    }
}
