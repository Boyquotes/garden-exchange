<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210422184535 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE profile_night_swap (id INT AUTO_INCREMENT NOT NULL, garden_id INT DEFAULT NULL, host_id INT DEFAULT NULL, camper_id INT DEFAULT NULL, status LONGTEXT NOT NULL, night_date DATETIME NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_575FBA8739F3B087 (garden_id), INDEX IDX_575FBA871FB8D185 (host_id), INDEX IDX_575FBA877701A506 (camper_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE profile_night_swap ADD CONSTRAINT FK_575FBA8739F3B087 FOREIGN KEY (garden_id) REFERENCES garden (id)');
        $this->addSql('ALTER TABLE profile_night_swap ADD CONSTRAINT FK_575FBA871FB8D185 FOREIGN KEY (host_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE profile_night_swap ADD CONSTRAINT FK_575FBA877701A506 FOREIGN KEY (camper_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE profile_night_swap');
    }
}
