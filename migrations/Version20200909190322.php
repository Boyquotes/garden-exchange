<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200909190322 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE profile_camping_type (profile_id INT NOT NULL, camping_type_id INT NOT NULL, INDEX IDX_C0545FE2CCFA12B8 (profile_id), INDEX IDX_C0545FE2F044BB62 (camping_type_id), PRIMARY KEY(profile_id, camping_type_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE profile_camping_type ADD CONSTRAINT FK_C0545FE2CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_camping_type ADD CONSTRAINT FK_C0545FE2F044BB62 FOREIGN KEY (camping_type_id) REFERENCES camping_type (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE profile_equipment');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE profile_equipment (profile_id INT NOT NULL, equipment_id INT NOT NULL, INDEX IDX_6FA73CF8CCFA12B8 (profile_id), INDEX IDX_6FA73CF8517FE9FE (equipment_id), PRIMARY KEY(profile_id, equipment_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE profile_equipment ADD CONSTRAINT FK_6FA73CF8517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_equipment ADD CONSTRAINT FK_6FA73CF8CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE profile_camping_type');
    }
}
