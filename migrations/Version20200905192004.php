<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200905192004 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE garden_rule (garden_id INT NOT NULL, rule_id INT NOT NULL, INDEX IDX_90163EA939F3B087 (garden_id), INDEX IDX_90163EA9744E0351 (rule_id), PRIMARY KEY(garden_id, rule_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE garden_rule ADD CONSTRAINT FK_90163EA939F3B087 FOREIGN KEY (garden_id) REFERENCES garden (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE garden_rule ADD CONSTRAINT FK_90163EA9744E0351 FOREIGN KEY (rule_id) REFERENCES rule (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE garden_rule');
    }
}
