<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200825155314 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE message_exchange (id INT AUTO_INCREMENT NOT NULL, conversation_exchange_id INT DEFAULT NULL, user_id INT DEFAULT NULL, content LONGTEXT NOT NULL, INDEX IDX_DA1D746886B0ACD0 (conversation_exchange_id), UNIQUE INDEX UNIQ_DA1D7468A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE conversation_exchange (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, content LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE conversation_exchange_user (conversation_exchange_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_BAA66CB386B0ACD0 (conversation_exchange_id), INDEX IDX_BAA66CB3A76ED395 (user_id), PRIMARY KEY(conversation_exchange_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE message_exchange ADD CONSTRAINT FK_DA1D746886B0ACD0 FOREIGN KEY (conversation_exchange_id) REFERENCES conversation_exchange (id)');
        $this->addSql('ALTER TABLE message_exchange ADD CONSTRAINT FK_DA1D7468A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE conversation_exchange_user ADD CONSTRAINT FK_BAA66CB386B0ACD0 FOREIGN KEY (conversation_exchange_id) REFERENCES conversation_exchange (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE conversation_exchange_user ADD CONSTRAINT FK_BAA66CB3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE message_exchange DROP FOREIGN KEY FK_DA1D746886B0ACD0');
        $this->addSql('ALTER TABLE conversation_exchange_user DROP FOREIGN KEY FK_BAA66CB386B0ACD0');
        $this->addSql('DROP TABLE message_exchange');
        $this->addSql('DROP TABLE conversation_exchange');
        $this->addSql('DROP TABLE conversation_exchange_user');
    }
}
