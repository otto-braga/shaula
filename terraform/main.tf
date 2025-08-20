
resource "aws_instance" "instance" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.webserver.id]
  user_data              = file("${path.module}/userdata.sh")
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  key_name = aws_key_pair.public_key.key_name

  associate_public_ip_address = true

  tags = {
    Name = "shaula_instance"
  }
}

resource "aws_key_pair" "public_key" {
  key_name   = "study-key"
  public_key = file("~/.ssh/study-key.pub")
}

resource "aws_security_group" "webserver" {
  name        = "shaula-webserver-sg"
  description = "Security group para web server"
  vpc_id      = data.aws_vpc.default.id

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }
}

resource "aws_iam_role" "ecr_read_only_role" {
  name = "ec2-role"

  # Política de confiança que permite que o serviço EC2 assuma esta role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

}

# Política customizada para acesso ao S3
resource "aws_iam_role_policy" "s3_access_policy" {
  name = "s3-access-policy"
  role = aws_iam_role.ecr_read_only_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.storage.arn,
          "${aws_s3_bucket.storage.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_read_only_attachment" {
  role       = aws_iam_role.ecr_read_only_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-instance-profile"
  role = aws_iam_role.ecr_read_only_role.name
}


# S3 Bucket para storage
resource "aws_s3_bucket" "storage" {
  bucket = "shaula-storage-bucket-${random_id.bucket_suffix.hex}"
}

# Sufixo aleatório para garantir unicidade do nome do bucket
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Bloqueio de acesso público
resource "aws_s3_bucket_public_access_block" "storage_pab" {
  bucket = aws_s3_bucket.storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Output com informações importantes
output "bucket_name" {
  description = "Nome do bucket S3"
  value       = aws_s3_bucket.storage.bucket
}

output "bucket_arn" {
  description = "ARN do bucket S3"
  value       = aws_s3_bucket.storage.arn
}

output "instance_public_ip" {
  description = "IP público da instância EC2"
  value       = aws_instance.instance.public_ip
}
