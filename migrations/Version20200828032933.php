<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200828032933 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE garden_zone_garden');
        $this->addSql('DROP TABLE zone_garden');
        $this->addSql('ALTER TABLE garden_zone MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE garden_zone DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE garden_zone ADD garden_id INT NOT NULL, ADD zone_id INT NOT NULL, DROP id, DROP name, DROP information, DROP picto');
        $this->addSql('ALTER TABLE garden_zone ADD CONSTRAINT FK_7625526239F3B087 FOREIGN KEY (garden_id) REFERENCES garden (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE garden_zone ADD CONSTRAINT FK_762552629F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_7625526239F3B087 ON garden_zone (garden_id)');
        $this->addSql('CREATE INDEX IDX_762552629F2C3FAB ON garden_zone (zone_id)');
        $this->addSql('ALTER TABLE garden_zone ADD PRIMARY KEY (garden_id, zone_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE garden_zone_garden (garden_zone_id INT NOT NULL, garden_id INT NOT NULL, INDEX IDX_DF20546DEE9B3199 (garden_zone_id), INDEX IDX_DF20546D39F3B087 (garden_id), PRIMARY KEY(garden_zone_id, garden_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE zone_garden (zone_id INT NOT NULL, garden_id INT NOT NULL, INDEX IDX_31A30989F2C3FAB (zone_id), INDEX IDX_31A309839F3B087 (garden_id), PRIMARY KEY(zone_id, garden_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE garden_zone_garden ADD CONSTRAINT FK_DF20546D39F3B087 FOREIGN KEY (garden_id) REFERENCES garden (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE garden_zone_garden ADD CONSTRAINT FK_DF20546DEE9B3199 FOREIGN KEY (garden_zone_id) REFERENCES garden_zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE zone_garden ADD CONSTRAINT FK_31A309839F3B087 FOREIGN KEY (garden_id) REFERENCES garden (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE zone_garden ADD CONSTRAINT FK_31A30989F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE garden_zone DROP FOREIGN KEY FK_7625526239F3B087');
        $this->addSql('ALTER TABLE garden_zone DROP FOREIGN KEY FK_762552629F2C3FAB');
        $this->addSql('DROP INDEX IDX_7625526239F3B087 ON garden_zone');
        $this->addSql('DROP INDEX IDX_762552629F2C3FAB ON garden_zone');
        $this->addSql('ALTER TABLE garden_zone ADD id INT AUTO_INCREMENT NOT NULL, ADD name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD information LONGTEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ADD picto VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, DROP garden_id, DROP zone_id, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
    }
}
