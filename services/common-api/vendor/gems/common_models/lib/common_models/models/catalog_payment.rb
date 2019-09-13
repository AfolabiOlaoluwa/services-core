module CommonModels
  class CatalogPayment < ActiveRecord::Base
    self.table_name = 'payment_service.catalog_payments'

    store_accessor :data,
      :amount,
      :card_id,
      :customer,
      :payment_method

    belongs_to :platform
    belongs_to :project
    belongs_to :user
    belongs_to :subscription
    belongs_to :contribution
    belongs_to :reward

    scope :pending, -> {
      left_join_with_processed_payments = <<-SQL
        LEFT JOIN payment_service.processed_payments
        ON payment_service.catalog_payments.id = payment_service.processed_payments.catalog_payment_id
      SQL

      joins(left_join_with_processed_payments)
        .where('payment_service.processed_payments.id IS NULL AND payment_service.catalog_payments.created_at >= ?', Date.today)
    }

    def is_bank_slip?
      payment_method == 'boleto'
    end

    def is_international?
      data['is_international']
    end

    def customer_type
      if customer['document_number'].try(:size) == 14
        'corporation'
      else
        'individual'
      end
    end

    def card_hash
      CreditCard.find_by(id: card_id).try(:card_hash)
    end
  end
end

