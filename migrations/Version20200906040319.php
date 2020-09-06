<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200906040319 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE profil_country_preference');
        $this->addSql('DROP TABLE profile_country');
        $this->addSql('ALTER TABLE profile ADD country_id INT DEFAULT NULL, ADD country_residence_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0FF92F3E70 FOREIGN KEY (country_id) REFERENCES country (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0F8781D3AF FOREIGN KEY (country_residence_id) REFERENCES country (id)');
        $this->addSql('CREATE INDEX IDX_8157AA0FF92F3E70 ON profile (country_id)');
        $this->addSql('CREATE INDEX IDX_8157AA0F8781D3AF ON profile (country_residence_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE profil_country_preference (profile_id INT NOT NULL, country_id INT NOT NULL, INDEX IDX_CA1DFD05CCFA12B8 (profile_id), INDEX IDX_CA1DFD05F92F3E70 (country_id), PRIMARY KEY(profile_id, country_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE profile_country (profile_id INT NOT NULL, country_id INT NOT NULL, INDEX IDX_80CD17FACCFA12B8 (profile_id), INDEX IDX_80CD17FAF92F3E70 (country_id), PRIMARY KEY(profile_id, country_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE profil_country_preference ADD CONSTRAINT FK_CA1DFD05CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profil_country_preference ADD CONSTRAINT FK_CA1DFD05F92F3E70 FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_country ADD CONSTRAINT FK_80CD17FACCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_country ADD CONSTRAINT FK_80CD17FAF92F3E70 FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0FF92F3E70');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0F8781D3AF');
        $this->addSql('DROP INDEX IDX_8157AA0FF92F3E70 ON profile');
        $this->addSql('DROP INDEX IDX_8157AA0F8781D3AF ON profile');
        $this->addSql('ALTER TABLE profile DROP country_id, DROP country_residence_id');
    }
}
